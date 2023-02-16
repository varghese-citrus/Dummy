#!/bin/bash
cd fixedops/data-validation
export FOPC_SITE_ID="suntrup2022" ROLE="admin" STORE="Suntrup Ford Westport" LOG="disable"
deno test -A --unstable --jobs=5 --filter "AEC-FOCP-UI-FN-LD" *.ts


