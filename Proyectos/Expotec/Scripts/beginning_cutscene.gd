extends Node3D



func _ready():
	$cutscene_anim_player.play("beginning")
	$cutscene_cam.current = true
	await get_tree().create_timer(8.0, false).timeout
	get_node("/root/" + get_tree().current_scene.name + "/Player").movable = true
	get_node("/root/" + get_tree().current_scene.name + "/Player/head/Camera3D").current = true
	get_node("/root/" + get_tree().current_scene.name + "/Player/head").movable = true
	$cutscene_cam.current = false
	queue_free()
