<?php
	require_once("authenticator.php");

	// Validate that $candidate_key_result is set and is a known value.
	if (!isset($candidate_key_result)) {
		$candidate_key_result = 0;
	}

	// Normalize to string for consistent comparison.
	$result = strval($candidate_key_result);

	switch ($result) {
		case "2":
			header("Location: final.html");
			exit;
		default:
			header("Location: error.html");
			exit;
	}
