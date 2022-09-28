# Github Actions Fast Pipelines

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a personal work in progress. Keep in mind your suggestions are welcome! :)

These workflows are highly opinionated **kubectl-apply** or **helm-upgrade** pipelines.

<img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/express.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/fastapi.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/flask.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/moleculer.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nestjs.svg" height="38"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" height="38">


## tldr;

1. Config tour repository with [these](#repository-secrets) secrets.
1. Create a directory `.github/workflow` in your repository and add [this](#pipeline) file.
1. Create a another directory `manifests` and add [this]() file.
1. Commit and open your repository actions page! :)


## Introduction

### Features

- Versioning with [Semantic-Release](https://semantic-release.gitbook.io/semantic-release/)
- Linter:
    - [Hadolint](https://github.com/marketplace/actions/hadolint-action) for Dockerfiles
    - ESLint for Javascript
    - PyLint for Python
- Static analysis: 
    - [GitLeaks](https://github.com/zricethezav/gitleaks) for repository
    - [Trivy](https://github.com/aquasecurity/trivy) for repository and image
    - Open Source Static Analysis Runner
    - GitHub's CodeQL analyzer
- Dynamic container generator

### Repository Patterns

This pipeline assumes you have just `4` types of repositories:

| Name | Short | Description | Result |
| ---: | :---: | --- | :---: |
| Web Application | app | Front-end application with internet-facing ingress | language-based pod |
| Mobile Application | mob | Mobile application | apk |
| Service | svc | Microservice that may - or may not - have ingress | nginx-based pod |
| Infrastructure as Code | iac | Code that generates cloud infrastructure | - |

Those repositories must obey a name pattern.

`{ecosystem}-{type}-{name/client/integration}`

Examples:

- `ff-svc-clients`: microservice that manages clients' data
- `ff-app-budget`: application that organizes the company finances
- `ff-mob-auth`: 2FA mobile application
- `ff-iac-aws`: infra as code to manage the aws environment

Checkout the test repositories:

| Type| Solution | Repository | Pipeline | Deploy |
| :---: | --- | :---: | :---: | :---: |
| app | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nginx.svg" height="27"> | [filipeforattini/ff-app-react](https://github.com/filipeforattini/ff-app-react) | ![](https://github.com/filipeforattini/ff-app-react/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-app-react/dev?label=deploy)](https://ff-app-react.dev.forattini.app) |
| app | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vuedotjs.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nginx.svg" height="27"> | [filipeforattini/ff-app-vue](https://github.com/filipeforattini/ff-app-vue) | ![](https://github.com/filipeforattini/ff-app-vue/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-app-vue/dev?label=deploy)](https://ff-app-vue.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/express.svg" height="27"> | [filipeforattini/ff-svc-express](https://github.com/filipeforattini/ff-svc-express) | ![](https://github.com/filipeforattini/ff-svc-express/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-express/dev?label=deploy)](https://ff-svc-express.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/fastapi.svg" height="27"> | [filipeforattini/ff-svc-fastapi](https://github.com/filipeforattini/ff-svc-fastapi) | ![](https://github.com/filipeforattini/ff-svc-fastapi/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-fastapi/dev?label=deploy)](https://ff-svc-fastapi.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/flask.svg" height="27"> | [filipeforattini/ff-svc-flask](https://github.com/filipeforattini/ff-svc-flask) | ![](https://github.com/filipeforattini/ff-svc-flask/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-flask/dev?label=deploy)](https://ff-svc-flask.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/moleculer.svg" height="27"> | [filipeforattini/ff-svc-moleculer](https://github.com/filipeforattini/ff-svc-moleculer) | ![](https://github.com/filipeforattini/ff-svc-moleculer/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-moleculer/dev?label=deploy)](https://ff-svc-moleculer.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nestjs.svg" height="27"> | [filipeforattini/ff-svc-nestjs](https://github.com/filipeforattini/ff-svc-nestjs) | ![](https://github.com/filipeforattini/ff-svc-nestjs/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-nestjs/dev?label=deploy)](https://ff-svc-nestjs.dev.forattini.app) |
| svc | <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" height="27"> <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nextdotjs.svg" height="27"> | [filipeforattini/ff-svc-nextjs](https://github.com/filipeforattini/ff-svc-nextjs) | ![](https://github.com/filipeforattini/ff-svc-nextjs/actions/workflows/pipeline.yml/badge.svg) | [![](https://img.shields.io/github/deployments/filipeforattini/ff-svc-nextjs/dev?label=deploy)](https://ff-svc-nextjs.dev.forattini.app) |

### Environments

| Name | Short | Description |
| ---: | :---: | --- |
| Development | dev | Env for you and your team to test and explore |
| Staging | stg | Stable env for code shipping |
| Sandbox | sbx | Production-like env for external developers |
| Production | prd | Where the magic happens |
| Disaster Recovery | dry | Production copy |

## Usage

### Flow

```mermaid
flowchart
  start[Start]
  analysis[Analysis]
  node-test[Node Tests]
  python-test[Python Tests]
  static-analysis[Static Analysis]
  
  start --- analysis

  analysis --- |event/push| static-analysis
  analysis --- |event/pull_request| static-analysis
  analysis --- |event/workflow_dispatch| trigger-manual

  static-analysis --- |lang/javascript| node-test
  static-analysis --- |lang/python| python-test
  static-analysis --- |lang/go| go-test
  
  subgraph node:
    node-test --- node-release
    node-release --- node-trigger
  end

  subgraph python:
    python-test --- python-release
    python-release --- python-trigger
  end

  subgraph go:
    go-test --- go-release
    go-release --- go-trigger
  end

  node-trigger --- |deployment/dev| finish
  python-trigger --- |deployment/dev| finish
  go-trigger --- |deployment/dev| finish

  trigger-manual --- |env/xxx| finish

  analysis --- |event/deployment| build
  build --- |env/dev| env-dev
  build --- |env/stg| env-stg
  build --- |env/prd| env-prd

  subgraph dev:
    env-dev --- |app.dev.domain.io| DEV
    env-dev --- |app-commit.dev.domain.io| DEV
  end

  subgraph stg:
    env-stg --- |app.stg.domain.io| STG
  end
  
  subgraph prd:
    env-prd --- |app.prd.domain.io| PRD
  end
```

### Repository Structure

```
├─ .github
│  └─ workflows
│  │  └─ pipeline.yml
│  └─ dependabot.yml
├─ manifests
│  ├─ configs
│  │  └─ dev.env
│  ├─ dependencies
│  │  └─ dev.yml
│  ├─ secrets
│  │  └─ dev.gpg
│  ├─ k8s.yml
│  └─ helm.yml
├─ build
│  // distibuition version of our code
└─ src
   // our code goes here
```

### Repository Secrets


| Name | Description |
| ---: | --- |
| GPG_PASSPHRASE |  |
| KUBE_CONFIG | Your `~/.kube/config` file as base64. |
| PIPELINE_DEPLOY_TOKEN | A GitHub token, see the permissions below. |
| REGISTRY_USERNAME | Registry username. |
| REGISTRY_PASSWORD | Registry password. |


### Pipeline

Add this pipeline to your repository creating a file `pipeline.yml` in your `.github/workflows` directory.

#### For SVC
```yml
name: pipeline

on: 
  push:
  deployment:
  release:
    types: [created]
  pull_request:
    types: [opened, reopened]

  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        type: choice
        default: 'dev'
        options:
        - dev
        - stg
        - prd

jobs:

  SVC:
    uses: filipeforattini/ff-iac-github-actions/.github/workflows/svc.yml@main
    secrets: inherit
    with:
      mainBranch: main
      containerRegistry: ghcr.io
      environmentsAsNamespaces: true
```

#### Parameters

| Name | Default | Description |
| --- | --- | --- |
| containerRegistry | ghcr.io | Container registry host that you will use |
| environmentsASnamespaces | false |  |


#### Deploy with kubetl apply

Create a file `k8s.yml` in your `manifests` directory.

```yml
#@data/values
---
port: 1234

env:
  - name: TZ
    value: America/Sao_Paulo

ingress:
  enable: true
  className: traefik

  tls:
    enable: true
    domain: your.domain
```

### Requirements

Configure your k8s cluster and get your `~/.kube/config`.

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

Thanks to:
- https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching
- https://github.blog/2022-05-09-supercharging-github-actions-with-job-summaries/
- https://blog.gitguardian.com/github-actions-security-cheat-sheet/

## Example ecosystem
This ecosystem generates few data per second as samples for our apis.


### Architecture

#### Full independent

In this implementation, each service has its own resources.

```mermaid
flowchart
  https---ingress

  subgraph k8s
    ingress---|ff-svc-nestjs.dev.forattini.app|nestjs
    ingress---|ff-svc-nextjs.dev.forattini.app|nextjs
    ingress---|ff-svc-fastapi.dev.forattini.app|fastapi
    ingress---|ff-svc-moleculer.dev.forattini.app|moleculer

    subgraph ff-svc-nextjs
      nextjs---rabbitmq-nextjs[rabbit]
    end
    
    subgraph ff-svc-moleculer
      moleculer---postgres-moleculer[postgres]
      moleculer---mysql-moleculer[mysql]
      moleculer---redis-moleculer[redis]
      moleculer---rabbitmq-moleculer[rabbit]
      moleculer---etcd-moleculer[etcd]
      moleculer---nats-moleculer[nats]

      moleculer---rabbitmq-nextjs
    end

    subgraph ff-svc-fastapi
      fastapi---postgres-fastapi[postgres]
      fastapi---rabbitmq-fastapi[rabbit]
      
      fastapi---rabbitmq-nextjs
    end

    subgraph ff-svc-nestjs
      nestjs---postgres-nestjs[postgres]
      nestjs---rabbitmq-nestjs[rabbitmq]

      nestjs---rabbitmq-nextjs
    end
  end
```

#### Shared resources

In this implementation, all services connects to a shared resource.

```mermaid
flowchart
  https---ingress

  subgraph k8s
    ingress---|ff-svc-nestjs.dev.forattini.app|nestjs
    ingress---|ff-svc-nextjs.dev.forattini.app|nextjs
    ingress---|ff-svc-fastapi.dev.forattini.app|fastapi
    ingress---|ff-svc-moleculer.dev.forattini.app|moleculer

    subgraph ff-svc-moleculer
      moleculer---postgres-moleculer[postgres]
      moleculer---mysql-moleculer[mysql]
      moleculer---redis-moleculer[redis]
      moleculer---rabbitmq-moleculer[rabbitmq]
      moleculer---etcd-moleculer[etcd]
      moleculer---nats-moleculer[nats]
    end

    subgraph ff-svc-nextjs
      nextjs---rabbitmq-moleculer
      nextjs---postgres-moleculer
      nextjs---mysql-moleculer
      nextjs---redis-moleculer
    end

    subgraph ff-svc-fastapi
      fastapi---postgres-moleculer
      fastapi---rabbitmq-moleculer
    end

    subgraph ff-svc-nestjs
      nestjs---postgres-moleculer
      nestjs---rabbitmq-moleculer
    end
  end
```
