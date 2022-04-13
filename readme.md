# github pipelines

Work in progress.

## Types

| --- | --- |
| Application | app | Front-end application with internet-facing ingress |
| Service | svc | Microservice that may - or may not - have ingress |
| Infrastructure as Code | iac | Code that generates cloud infrastructure |

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
