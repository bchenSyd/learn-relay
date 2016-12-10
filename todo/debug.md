{
  person(id:2) {
   ...personalInfo
    friends{
      ...personalInfo
    }
  }
}

fragment personalInfo on Person{
  name,
  age,
  debug
}

==>
{
  "data": {
    "person": {
      "name": "bo chen",
      "age": 34,
      "debug": "2",
      "friends": [
        {
          "name": "Joanna chen",
          "age": 6,
          "debug": "from 1"
        }
      ]
    }
  }
}