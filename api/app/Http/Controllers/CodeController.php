<?php

namespace App\Http\Controllers;

use App\Game;
use App\Player;
use Illuminate\Http\Request;

class CodeController extends Controller
{
    public function login(Request $request) {

        $request->validate([
            'code' => 'required',
            'name' => 'required|min:2|max:255'
        ]);
        
        $game = Game::where('code', $request->input('code'))->first();
        $player = Player::where('name', $request->input('name'))->first();
        
        if($player && $player->games->contains($game)){
            $errors = [
                'errors' => [
                    0 => 'Nom déjà utilisé, veuillez en choisir un autre !',
                ]
                ];
            return response()->json($errors, 422);
        }

        if(!$player){
            $player = new Player();
            $player->name = $request->input('name');
            $player->save();
            $player->games()->attach($game);

            $token = [
                'player' => $player->id,
                'game' => $game->id,
            ];
            $token = encrypt($token);

            $player->token = $token;
            $player->save();

            return response()->json($token);
        }
        
    }

    public function checkCode(Request $request) {

        $code = $request->input('code');

        if(!$code) {
            return response()->json('Aucun code renseigné');
        }

        $game = \App\Game::where('code', $code)->first();

        if($game) {
            return response()->json($game->code);
        }  else {
            return response()->json(false);
        }
        
        
    }
}