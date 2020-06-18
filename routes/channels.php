<?php

use App\Entities\Room;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
 

 Broadcast::channel('chat.broadcast.{chatRoomId}', function ($user, $chatRoomId) {
    Log::info('cht routeee '.$chatRoomId);
    $chatRoomUsers = Room::with('users')->find($chatRoomId)->users;
    return $chatRoomUsers->contains($user);
}); 


Broadcast::channel('online', function ($user) {
    if (auth()->check()) {
        return $user->toArray();
    }
});