# Github Actions

Work in progress.

Your repo as an auto-helm upgrade pipeline.

## Types

This pipeline assumes you have just `3` types of repositories:

| Name | Short | Description |
| --- | --- | --- |
| Application | app | Front-end application with internet-facing ingress |
| Service | svc | Microservice that may - or may not - have ingress |
| Infrastructure as Code | iac | Code that generates cloud infrastructure |

Those repositories must obey a name pattern.

`{ecossystem}-{type}-{name/client/integration}`

Examples:

- `ff-svc-clients`: microservice that manages clients' data
- `ff-app-budget`: application that organizes the company finances
- `ff-iac-aws`: iac code to manage the aws environment

## Setup

Your repository need to implement:

```yml
name: My pipeline
on: ['push', 'pull_request']

jobs:

  Service:
    uses: filipeforattini/ff-iac-github-actions/.github/workflows/service.yml@main
    with:
      containerRegistry: ghcr.io

  Outputs:
    needs: Service
    steps:
      - run: echo PipelineSetup=${{ needs.Service.outputs.PipelineConfig }}
```

### Parameters

| Name | Default | Description |
| --- | --- | --- |
| containerRegistry | ghcr.io | Container registry host that you will use |

## Workflow

1. Setup: organizes the whole workflow jobs' inputs.
    
    1. Checkout your code and few tools from this repo.
    1. Runs scrappers to extract information from your repository and environment keys.
    1. Define which path should this build go.

1. Depending on the event

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

            1. 