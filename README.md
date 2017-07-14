This is a little  app made for a frontend interview challenge. It uses Express as the server and  vanilla JavaScript and CSS to search a static data file and display the returned results.

## Intention:
- Impress interviewing committee. :raised_hands:
- Receive helpful feedback and grow from it. :white_check_mark:
- Both of the above :sparkles:

##  Design:
- Clean, company-branded UI.
- Small microinteractions for a little interactivity.
- Hopefully  clear UX (for searching, filtering results, viewing more results, vieiwng company details, and understanding when there aren't any results).
- Responsive (mostly... I'm not using Sass!).
- Links promoting myself, since this is part of an interview.

##  Logic:

##### Request Parameters & URL:
- The companies API lives at [http://localhost:3000/api/companies](http://localhost:3000/api/companies).
-  It takes in the following parameters:

| Query param | Effect |
| ----------- | ------ |
| q           | Limits the results to companies with names that match `q` |
| start       | Returns result starting at the `start`th result |
| limit       | Restricts the result set to include no more than `limit` results |
| laborTypes  | A comma delimited list of labor types to filter by (all must match) |

##### These events trigger the request:
- One second has passed from the last keystroke.
- The user hits enter or clicks the search icon.
- The user adds a search parameter to filter based on labor type.

##### The server returns back:
- All matches to the search query, in paginated  batches of twenty.
- Each item expands when clicked to show the company details.
- If there are no matches, an apologetic error is displayed instead.
- Here's a response object example:
```js
{
  "total": 500,
  "results": [
    {
      "avatarUrl": "https:\/\/bc-prod.imgix.net\/avatars\/5430e7a55cdc2e0300dd72ef.png?auto=format&fit=fill&bg=fff",
      "laborType": [
        "Union"
      ],
      "name": "BASS Electric",
      "phone": "(261) 917-1637",
      "website": "http:\/\/bufodu.ps\/pakzer"
    },
    {
      "avatarUrl": "https:\/\/bc-prod.imgix.net\/avatars\/5430e7a55cdc2e0300dd7310.jpeg?auto=format&fit=fill&bg=fff",
      "laborType": [
        "Non-Union",
        "Union"
      ],
      "name": "Rex Moore Group, Inc.",
      "phone": "(949) 700-2752",
      "website": "http:\/\/wa.ch\/wisli"
    }
  ]
}
```
#
####  Thanks for taking the time to check out this repo and README.<3
#