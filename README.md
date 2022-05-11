# Github Actions Fast Pipelines

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


This is a personal work in progress.

Your repo as an auto-helm upgrade or k8s-apply pipeline.

## Features

- Semantic Versioning: [Semantic-Release](https://semantic-release.gitbook.io/semantic-release/)
- Linter:
    - [Hadolint](https://github.com/marketplace/actions/hadolint-action) for Dockerfiles
- Docerfile analysis:
    - [Trivy](https://aquasecurity.github.io/trivy/)
- Code analysis: 
    - [GitLeaks](https://github.com/zricethezav/gitleaks) for repository
    - [Trivy](https://github.com/aquasecurity/trivy) for repository and image
    - [SonarQube](https://www.sonarqube.org/)

## Usage

### Repository Patterns

This pipeline assumes you have just `3` types of repositories:

| Name | Short | Description |
| --- | --- | --- |
| Application | app | Front-end application with internet-facing ingress |
| Service | svc | Microservice that may - or may not - have ingress |
| Infrastructure as Code | iac | Code that generates cloud infrastructure |

Those repositories must obey a name pattern.

`{ecosystem}-{type}-{name/client/integration}`

Examples:

- `ff-svc-clients`: microservice that manages clients' data
- `ff-app-budget`: application that organizes the company finances
- `ff-iac-aws`: iac code to manage the aws environment

### Setup

Your repository need to implement:

```yml
name: My pipeline
on: ['push', 'pull_request']

jobs:

  Service:
    uses: filipeforattini/ff-iac-github-actions/.github/workflows/service.yml@main
    with:
      containerRegistry: ghcr.io
```

### Parameters

| Name | Default | Description |
| --- | --- | --- |
| containerRegistry | ghcr.io | Container registry host that you will use |

### Requirements

Configure your 

### Workflows


#### A) Service Push

##### 1. Setup:
Organizes the whole workflow jobs' inputs.

1. Checkout your code and few tools from this repo.
1. Configure repository environments.
    1. List all environments
        - for (env in [dev, stg, sbx, prd, dry]):
            1. 
1. Runs scrappers to extract information from your repository and environment keys.
1. <small>(TODO)</small> Updates repository configs
    1. <small>(TODO)</small> Create environments
1. Define which path should this build go.

##### 2. Depending on the event

- if [ event_name = push ]
    1. Build your repository. Supported: nodejs, python
        1. Checkout your code and few tools from this repo again.
        1. Define few variables for your build
        1. Install version
        1. Loads cache that matches with your repository organization
        1. Install dependencies
        1. Runs few scripts
        1. Generates a .dockerignore, if there isn't one
        1. Generates a dockerfile, if there isn't one
        1. Setups docker builder
        1. Log-in into your Container Registry
        1. Builds and push the container
    1. Deploy your container into your DEV environment
- if [ event_name = pull_request ]
    1. Code quality check
        1. Checkout your code and few tools from this repo again.
        1. Define few variables for your build
    1. Team approval

## Daily work

### Commits & Versioning

```bash
git commit -m "action(scope): subject"
```

Where the actions:
- `feat`: new feature for the user, not a new feature for the build script
- `fix`: bug fix for the user, not a fix for a build script
- `docs`: documentation changes
- `style`: formatting, lack of semicolons, etc; no changes to the production code
- `refactor`: refactoring the production code, for example. renaming a variable
- `test`: adding missing tests, refactoring tests; no changes to the production code
- `chore`:updating grunted tasks, etc; no changes to the production code

Adds `BREAKING CHANGE` in the commit message and it will generate a new **major** version.

### Secrets

```bash
gpg -v \
  --symmetric \
  --cipher-algo AES256 \
  --output ./manifests/secrets/dev.gpg \
  ./manifests/secrets/dev.env
```

    