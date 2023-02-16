## FOPC Orchestrator

It will check all the visual test cases by default for the production site

## How to create a workspace for FixedOps Orchestrator in Home Creators Sandbox

```
❯ just repo-ensure git.netspective.io/netspective-foc3/fixedops-orchestrator
❯ just vscws-repos-ensure-ref git.netspective.io/netspective-foc3/fixedops-orchestrator/netspective-fixedops-orchestrator.code-workspace
❯ code netspective-fixedops-orchestrator.code-workspace
```

#### How to run Visual test for Production

cd <testcases folder path> (Ex:- cd fixedops/testcases)

If the environment variable (FOPC_SITE_ID) is not set

```zsh
❯ export FOPC_SITE_ID="<site ID>" ROLE="<role>" STORE="<store name>"

## Run single test cases

❯ deno test -A --unstable <filename>.ts

```
## Run all test cases

```zsh

❯ deno test -A --unstable --filter "AEC-FOCP-<**>-<**>-<**>"*.ts 

```

# TODO Refactoring required

- Create a log file for writing the test results
- Automatically run the FOPC test cases after the sandbox deployment
- Made parameter based Tests for Sandboxes ( Modules can be given as input
  parameter )

# Deno Compatible Versions

## Installation Command

```
asdf install deno 1.23.4
asdf local deno 1.23.4
```

## PUPPETEER Compatible Version for Chrome

```
PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.2/install.ts
Update deps-test.ts with puppeteer version 9.0.2
```

## PUPPETEER Compatible Version for Firefox

```
PUPPETEER_PRODUCT=firefox deno run -A --unstable https://deno.land/x/puppeteer@14.1.1/install.ts
Update deps-test.ts with puppeteer version 14.1.1
```

Pass the argument `product: "firefox"` in `start-browser.ts` while launching the browser.
