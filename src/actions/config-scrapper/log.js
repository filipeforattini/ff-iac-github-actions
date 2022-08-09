const _ = require('lodash')

module.exports = {
  templateInfo: (context, ...args) => ':: ' +  _.pad(context, 13) + ' | ' + args.join('\n'),

  templateDetails: _.template(`<details>
<summary><%= summary %></summary>

\`\`\`json
<%= content %>
\`\`\`

</details>`)
}
