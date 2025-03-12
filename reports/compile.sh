#!/bin/sh

# Copyright 2025 Ana Oliveira, Humberto Gomes, Inês Marques, Rafael Vilas Boas, Sara Lopes
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cd "$(realpath "$(dirname -- "$0")/")" || exit 1
mkdir -p "build"
[ "$#" -ge 1 ] && enum_files='printf "%s\n" "$@"' || enum_files='find . -type f -name *.tex'

eval "$enum_files" | while IFS="" read -r file; do
    hash="$(echo "$file" | sha1sum | grep -o '^\w*')"
    out_dir="/tmp/latex/$hash"
    pdf_name="$(echo "$file" | sed 's/.tex$/.pdf/g')"

    mkdir -p "$out_dir" || exit 1
    pdflatex -halt-on-error -output-directory "$out_dir" "$file" < /dev/null || exit 1
    cp "$out_dir/$pdf_name" build
done
