extends Control

@export var scene_name: String


func _ready():
	await get_tree().create_timer(4.0, false).timeout
	get_tree().change_scene_to_file("res://Scenes/" + scene_name + ".tscn")
