extends Control

func play():
	get_tree().change_scene_to_file("res://Scenes/level.tscn")
	
func quit():
	get_tree().quit()
