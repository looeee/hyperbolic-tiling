<?php
	function incrementFileName($file_path,$filename){
		$array = explode(".", $filename);
		$file_ext = end($array);
		$root_name = str_replace(('.'.$file_ext),"",$filename);
		$file = $file_path.$filename;
		$i = 1;

		while(file_exists($file)){
			$file = $file_path.$root_name.$i.'.'.$file_ext;
			$i++;
		}
		return $file;
	}



	define('UPLOAD_DIR', 'images/saved/');
	$img = $_POST['img'];
	echo $img;
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$file = 'canvas.png';

	$file = incrementFileName(UPLOAD_DIR, $file);

	echo 'test'.$file;


	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';


?>
