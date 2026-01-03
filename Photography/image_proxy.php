// image_proxy.php
<?php
$image = $_GET['img'];
$allowed = ['image1.jpg', 'image2.jpg']; // Whitelist allowed images

if (in_array($image, $allowed)) {
    header('Content-Type: image/jpeg');
    readfile('images/' . $image);
} else {
    header('HTTP/1.0 403 Forbidden');
}
?>