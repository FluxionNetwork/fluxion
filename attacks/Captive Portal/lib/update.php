<?php
	require_once("authenticator.php");

	// Match the AJAX callers that request JSON and react to a boolean.
	header("Content-Type: application/json");

	// Validate that $candidate_key_result is set.
	if (!isset($candidate_key_result)) {
		$candidate_key_result = 0;
	}

	// Candidate key result is "2" when authentication succeeded.
	// Everything else (including unset) should be treated as a failure.
	$authenticated = ($candidate_key_result === "2" || $candidate_key_result === 2);

	echo json_encode($authenticated);
	exit;
