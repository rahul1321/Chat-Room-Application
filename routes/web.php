<?php

use App\Entities\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes(['verify' => true]);


Route::group(['middleware' => 'verified','auth'], function () {
    Route::get('/home', 'HomeController@index')->name('home');
    Route::get('/userchatrooms', 'RoomsController@userRooms')->name('user.rooms');
    Route::resource('users', 'UsersController');
    Route::resource('chatrooms', 'RoomsController');
    Route::resource('chats', 'ChatsController');
    Route::put('/addusertoroom/{roomId}', 'RoomsController@addUserToRoom'); 
    Route::put('/removeuserfromroom/{roomId}', 'RoomsController@removeUserFromRoom');
});

