extends Control

func _ready():
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

func to_menu():
	get_tree().change_scene_to_file("res://Scenes/main_menu.tscn")
