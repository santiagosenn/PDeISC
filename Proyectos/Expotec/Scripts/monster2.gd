extends CharacterBody3D

@export var waypoints: Array[Node3D] = []
@export var SPEED_PATROL := 2.5
@export var SPEED_CHASE := 4.0
@export var vision_range := 15.0
@export var vision_fov_degrees := 90.0
@export var lose_distance := 20.0
@export var lose_time := 3.0
@export var jumpscareTime := 2.0
@export var scene_name: String

var player: Node3D
var _state := "PATROL"
var _current_wp := 0
var _last_seen_time := 0.0
var caught := false
var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")

@onready var agent: NavigationAgent3D = $NavigationAgent3D
@onready var footstep: AudioStreamPlayer3D = $AudioStreamPlayer3D
@onready var jumpscare_camera: Camera3D = $jumpscare_camera
@onready var jumpscare_audio: AudioStreamPlayer3D = $jumpscare

func _ready():
	add_to_group("monster")
	player = get_tree().get_current_scene().get_node_or_null("Player")
	if player == null:
		player = get_tree().get_first_node_in_group("player")

	agent.path_desired_distance = 0.5
	agent.target_desired_distance = 0.5

	if waypoints.size() > 0:
		agent.target_position = waypoints[_current_wp].global_position

func _physics_process(delta):
	if not visible or caught:
		return

	if not is_on_floor():
		velocity.y -= gravity * delta

	match _state:
		"PATROL":
			_patrol()
			if _can_see_player():
				_state = "CHASE"
		"CHASE":
			_chase()
			if not _can_see_player():
				_last_seen_time += delta
			else:
				_last_seen_time = 0.0
			if _distance_to_player() > lose_distance and _last_seen_time >= lose_time:
				_state = "PATROL"
				_set_next_wp_closest()

	_check_catch_player()
	_do_move()
	_play_footsteps(delta)

func _patrol():
	if waypoints.size() == 0:
		return
	if agent.distance_to_target() < 5.0:
		_current_wp = (_current_wp + 1) % waypoints.size()
		agent.target_position = waypoints[_current_wp].global_position

func _chase():
	if is_instance_valid(player):
		agent.target_position = player.global_position

func _do_move():
	if agent.is_navigation_finished():
		velocity = Vector3.ZERO
	else:
		var next_pos = agent.get_next_path_position()
		var dir = (next_pos - global_position).normalized()
		var speed = SPEED_PATROL if _state == "PATROL" else SPEED_CHASE
		var new_velocity = dir * speed
		agent.set_velocity(new_velocity)

func _on_NavigationAgent3D_velocity_computed(safe_velocity: Vector3) -> void:
	velocity = velocity.move_toward(safe_velocity, 0.25)
	move_and_slide()

func _can_see_player() -> bool:
	if not is_instance_valid(player):
		return false
	var dist = _distance_to_player()
	if dist > vision_range:
		return false

	var to_player = (player.global_position - global_position).normalized()
	var forward = -global_transform.basis.z
	var angle = rad_to_deg(acos(clamp(forward.dot(to_player), -1.0, 1.0)))
	if angle > vision_fov_degrees * 0.5:
		return false

	var space_state = get_world_3d().direct_space_state
	var from_pos = global_position + Vector3.UP * 1.6
	var to_pos = player.global_position + Vector3.UP * 1.6

	var params := PhysicsRayQueryParameters3D.create(from_pos, to_pos)
	params.exclude = [self]
	var hit = space_state.intersect_ray(params)
	if hit.is_empty():
		return true
	return hit.get("collider") == player

func _distance_to_player() -> float:
	return global_position.distance_to(player.global_position) if is_instance_valid(player) else INF

func _set_next_wp_closest():
	if waypoints.size() == 0:
		return
	var closest := 0
	var best := INF
	for i in range(waypoints.size()):
		var d = global_position.distance_to(waypoints[i].global_position)
		if d < best:
			best = d
			closest = i
	_current_wp = closest
	agent.target_position = waypoints[_current_wp].global_position

func _check_catch_player():
	if not is_instance_valid(player) or caught:
		return
	if _distance_to_player() <= 2.0:
		player.visible = false
		if not jumpscare_audio.playing:
			jumpscare_audio.play()
		caught = true
		_state = "CAUGHT"
		agent.set_velocity(Vector3.ZERO)
		jumpscare_camera.current = true
		await get_tree().create_timer(jumpscareTime, false).timeout
		get_tree().change_scene_to_file("res://Scenes/" + scene_name + ".tscn")

func _play_footsteps(delta):
	var spd = velocity.length()
	if spd < 0.1:
		return
	if footstep and not footstep.playing:
		footstep.play()
