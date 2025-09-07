extends Control

@onready var pause_menu = get_node("/root/level/Menu_pause")

func _ready():
	visible = false

func show_menu():
	visible = true
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

func _process(delta):
	# Si se aprieta la acción "atras", volvemos al menú de pausa
	if visible and Input.is_action_just_pressed("atras"):
		visible = false
		pause_menu.visible = true
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)  # mantiene el mouse visible
