const _ = require('lodash')

module.exports = {
  templateInfo: (context, ...args) => ':: ' +  _.pad(context, 12) + ' | ' + args.join('\n'),

  templateDetails: _.template(`<details>
<summary><%= summary %></summary>

\`\`\`json
<%= content %>
\`\`\`

</details>`)
}
