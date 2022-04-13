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

1. Organizes build path.
    
    1. Teste 
