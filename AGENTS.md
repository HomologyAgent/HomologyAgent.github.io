# HomologyAgent Pages instructions

- This repository is the independent Jekyll site for
  `HomologyAgent/HomologyAgent.github.io`.
- It reads published source metadata from the separate DXSrc repository. Do not
  copy DXSrc plugins or its `release/` tree into this repository.
- Keep the selector static and backend-free. It may generate and download a
  `dxplay.json`, but it must not collect credentials or proxy source requests.
