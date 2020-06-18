<?php

namespace App\Http\Controllers;

use App\Entities\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Prettus\Validator\Contracts\ValidatorInterface;
use Prettus\Validator\Exceptions\ValidatorException;
use App\Http\Requests\RoomCreateRequest;
use App\Http\Requests\RoomUpdateRequest;
use App\Repositories\RoomRepository;
use App\Validators\RoomValidator;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Class RoomsController.
 *
 * @package namespace App\Http\Controllers;
 */
class RoomsController extends Controller
{
    /**
     * @var RoomRepository
     */
    protected $repository;

    /**
     * @var RoomValidator
     */
    protected $validator;

    /**
     * RoomsController constructor.
     *
     * @param RoomRepository $repository
     * @param RoomValidator $validator
     */
    public function __construct(RoomRepository $repository, RoomValidator $validator)
    {
        $this->repository = $repository;
        $this->validator  = $validator;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('rooms.index');
    }

    public function userRooms()
    {
       
        $rooms = Auth::user()->rooms;

        if (request()->wantsJson()) {

            return response()->json(['rooms' => $rooms,'loggedinuser' => Auth::user()]);
        }

        return view('rooms.index', compact('rooms'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  RoomCreateRequest $request
     *
     * @return \Illuminate\Http\Response
     *
     * @throws \Prettus\Validator\Exceptions\ValidatorException
     */
    public function store(RoomCreateRequest $request)
    {
        try {

            $this->validator->with($request->all())->passesOrFail(ValidatorInterface::RULE_CREATE);

            $room = $this->repository->create([
                'name' => $request->name,
                'owner_id' => auth()->id(),
                'is_active' => true
            ]);

            $room->users()->syncWithoutDetaching(auth()->id());

            $response = [
                'message' => 'Room created.',
                'room'    => $room->toArray(),
            ];

            if ($request->wantsJson()) {

                return response()->json($response);
            }

            return redirect()->back()->with('message', $response['message']);
        } catch (ValidatorException $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'error'   => true,
                    'message' => $e->getMessageBag()
                ]);
            }

            return redirect()->back()->withErrors($e->getMessageBag())->withInput();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $room = $this->repository->with(['chats.user:id,name','users'])->find($id);

        if (request()->wantsJson()) {

            return response()->json([
                'room' => $room,
            ]);
        }

        return view('rooms.show', compact('room'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $room = $this->repository->find($id);

        return view('rooms.edit', compact('room'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  RoomUpdateRequest $request
     * @param  string            $id
     *
     * @return Response
     *
     * @throws \Prettus\Validator\Exceptions\ValidatorException
     */
    public function update(RoomUpdateRequest $request, $id)
    {
        try {
            Log::info($request->description);
            $this->validator->with($request->all())->passesOrFail(ValidatorInterface::RULE_UPDATE);

            $room = $this->repository->update($request->all(), $id);

            $response = [
                'message' => 'Room updated.',
                'room'    => $room->toArray(),
            ];

            if ($request->wantsJson()) {

                return response()->json($response);
            }

            return redirect()->back()->with('message', $response['message']);
        } catch (ValidatorException $e) {

            if ($request->wantsJson()) {

                return response()->json([
                    'error'   => true,
                    'message' => $e->getMessageBag()
                ]);
            }

            return redirect()->back()->withErrors($e->getMessageBag())->withInput();
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $deleted = $this->repository->delete($id);

        if (request()->wantsJson()) {

            return response()->json([
                'message' => 'Room deleted.',
                'deleted' => $deleted,
            ]);
        }

        return redirect()->back()->with('message', 'Room deleted.');
    }

    public function addUserToRoom(Request $request, $roomid)
    {
        try {
            //$this->validator->with($request->all())->passesOrFail(ValidatorInterface::RULE_UPDATE);

            $room = $this->repository->find($roomid);
            $room->users()->syncWithoutDetaching($request->user_id);
            
            $response = [
                'message' => 'User Added to the Room.',
                'room'    => $room->toArray(),
            ];

            if ($request->wantsJson()) {
                return response()->json($response);
            }
            return redirect()->back()->with('message', $response['message']);
        } catch (ValidatorException $e) {

            if ($request->wantsJson()) {

                return response()->json([
                    'error'   => true,
                    'message' => $e->getMessageBag()
                ]);
            }

            return redirect()->back()->withErrors($e->getMessageBag())->withInput();
        }
    }

    public function removeUserFromRoom(Request $request, $roomid)
    {
        try {
            //$this->validator->with($request->all())->passesOrFail(ValidatorInterface::RULE_UPDATE);

            $room = $this->repository->find($roomid);
            $room->users()->detach($request->user_id);
            
            $response = [
                'message' => 'User removed from the Room.',
                'room'    => $room->toArray(),
            ];

            if ($request->wantsJson()) {
                return response()->json($response);
            }
            return redirect()->back()->with('message', $response['message']);
        } catch (ValidatorException $e) {

            if ($request->wantsJson()) {

                return response()->json([
                    'error'   => true,
                    'message' => $e->getMessageBag()
                ]);
            }

            return redirect()->back()->withErrors($e->getMessageBag())->withInput();
        }
    }
}
