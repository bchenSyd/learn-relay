import { casual } from './utils';

const marketsResolver = ()=> {
   return [
            {
              "name": "Win",
              "betTypes": [
                {
                  "name": "Win",
                  "priceTypes": [
                    {
                      "code": "WT5",
                      "name": "Tote+5%",
                      "eachWay": true
                    }
                  ],
                  "displayName": "Win"
                }
              ]
            },
            {
              "name": "Place",
              "betTypes": [
                {
                  "name": "Place",
                  "priceTypes": [
                    {
                      "code": "PT5",
                      "name": "Tote+5%",
                      "eachWay": false
                    }
                  ],
                  "displayName": "Place"
                }
              ]
            },
            {
              "name": "Exotics",
              "betTypes": [
                {
                  "name": "Quinella",
                  "priceTypes": [
                    {
                      "code": null,
                      "name": null,
                      "eachWay": null
                    }
                  ],
                  "displayName": "Quinella"
                },
                {
                  "name": "Exacta",
                  "priceTypes": [
                    {
                      "code": null,
                      "name": null,
                      "eachWay": null
                    }
                  ],
                  "displayName": "Exacta"
                },
                {
                  "name": "Trifecta",
                  "priceTypes": [
                    {
                      "code": null,
                      "name": null,
                      "eachWay": null
                    }
                  ],
                  "displayName": "Trifecta"
                },
                {
                  "name": "FirstFour",
                  "priceTypes": [
                    {
                      "code": null,
                      "name": null,
                      "eachWay": null
                    }
                  ],
                  "displayName": "First Four"
                }
              ]
            }
          ];
}

export default marketsResolver;