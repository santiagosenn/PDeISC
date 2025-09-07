extends StaticBody3D

var interactable = true
var opened = false

func enemy_interact():
	if opened == false && get_parent().get_parent().locked == false:
		opened = true
		$open.play()
		interactable = false
		$AnimationPlayer.play("open")
		await get_tree().create_timer(1.0, false).timeout
		interactable = true

func interact():
	if get_parent().get_parent().locked == true && get_parent().get_parent().key == null:
		$locked.play()
		get_parent().get_parent().locked = false
	if interactable == true && get_parent().get_parent().locked == false:
		interactable = false
		opened = !opened
		if opened == false:
			$AnimationPlayer.play("close")
			$close.play()
		if opened == true:
			$AnimationPlayer.play("open")
			$open.play()
		await get_tree().create_timer(1.0, false).timeout
		interactable = true
	if interactable == true && get_parent().get_parent().locked == true:
		$locked.play()
		interactable = false
		$AnimationPlayer.play("locked")
		await get_tree().create_timer(0.7, false).timeout
		interactable = true
