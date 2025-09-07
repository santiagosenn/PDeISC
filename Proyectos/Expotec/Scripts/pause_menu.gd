extends Control

@onready var controls_menu = get_node("/root/level/ControlsMenu")

func _process(delta):
	if Input.is_action_just_pressed("pausa"):
		if not controls_menu.visible:
			get_tree().paused = !get_tree().paused
			visible = get_tree().paused
			if get_tree().paused == true:
				Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
			if get_tree().paused == false:
				Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func resumer():
	get_tree().paused = false
	visible = false
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	
func back_to_menur():
	get_tree().paused = false
	get_tree().change_scene_to_file("res://Scenes/main_menu.tscn")

func quit_gamer():
	get_tree().quit()

func Control_menu():
	visible = false
	controls_menu.show_menu()
