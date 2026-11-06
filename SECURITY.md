# Security Policy

## Reporting a Vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately through GitHub's
[**Report a vulnerability**](https://github.com/FluxionNetwork/fluxion/security/advisories/new)
form (Security -> Advisories). This opens a private draft advisory only the
maintainers and you can see, where we can discuss details, a fix, and
coordinated disclosure.

If you cannot use the GitHub form, you may request a contact address by
opening a minimal issue that says only "requesting a security contact" --
without any vulnerability details.

## What to include

- Affected file(s), function, and approximate line numbers
- A description of the impact and the conditions required to trigger it
- A proof of concept, or a minimal reproduction script, where possible
- The commit hash you tested against (Fluxion is used from a `git clone`)

## Supported versions

Fluxion is distributed from source; there are no numbered releases. Only the
current `master` branch is supported and fixed. Please test against the latest
`master` before reporting.

## Scope

Fluxion is a wireless security-auditing and social-engineering research tool
that normally runs with root privileges. Security reports we are interested in
concern flaws in **Fluxion itself** -- for example, untrusted input from
scanned networks (SSIDs, scanner output, client data) leading to command
execution, file overwrite, or privilege issues on the operator's machine.

Using Fluxion against networks you do not own or have explicit written
permission to test is illegal and is outside the scope of this policy.

## Coordinated disclosure

We ask that you give us a reasonable period to release a fix before any public
disclosure, and we will credit reporters in the advisory unless you prefer to
remain anonymous. If a CVE is being assigned through another CNA, let us know
so we can link it and avoid duplicate entries.
