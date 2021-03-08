
<?php
$simple_string = "Welcome\n";
echo "Original String: " . $simple_string; 

$ciphering = "AES-128-CTR";
$iv_length = openssl_cipher_iv_length($ciphering); 
$options = 0;

// Non-NULL Initialization Vector for encryption 
$encryption_iv = '1234567891011121';
$encryption_key = "ThisIsATest";

// Use openssl_encrypt() function to encrypt the data 
$encryption = openssl_encrypt($simple_string, $ciphering, 
            $encryption_key, $options, $encryption_iv);

echo "Encrypted String: " . $encryption . "\n";
$decryption_iv = '1234567891011121';
$decryption_key = "GeeksforGeeks";
$decryption=openssl_decrypt ($encryption, $ciphering,
        $decryption_key, $options, $decryption_iv);

echo "Decrypted String: " . $decryption;
?>

