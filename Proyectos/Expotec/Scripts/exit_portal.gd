extends Area3D

@export var scene_name: String

func enter_trigger(body):
	if body.name == "Player":
		get_tree().change_scene_to_file("res://Scenes/" + scene_name + ".tscn")
