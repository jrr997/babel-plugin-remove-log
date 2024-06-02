# babel-plugin-remove-log

Remove your colleagues' annoying `console.log`.

## Install

First, You should have installed `git`, and then:

```bash
npm install babel-plugin-remove-log --save-dev
```

## Usage

Use with babel:

```json
{
  "plugins": [["babel-plugin-remove-log"]]
}
```

## options

| Property            | Description                                  | Type       | Default |
| ------------------- | -------------------------------------------- | ---------- | ------- |
| disabledCurrentUser | Remove `console.log` that you have committed | boolean    | false   |
| users               | Don't remove `console.log` of these users    | `string[]` | -       |

## How it works?

Use `git blame` to find your colleagues' `console.log` statements and remove them.
