<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

/**
 * Class Room.
 *
 * @package namespace App\Entities;
 */
class Room extends Model 
{

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name','owner_id','is_active','description'];


    public function users(){
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function chats(){
        return $this->hasMany(Chat::class);
    }
}
