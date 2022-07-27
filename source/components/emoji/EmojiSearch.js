import { useState } from "react"

import styled from "styled-components"

import emojiSearchJSON from "./emoji-search-min.json"


const EmojiBox = ({ theEmoji }) => {

  const [filteredEmojis, setFilteredEmojis] = useState(emojiSearchJSON)

  const filterEmoji = e => {

    const text = e.target.value.trim().toLowerCase()

    setFilteredEmojis(emojiSearchJSON.filter(item => item.name.includes(text)))

  }

  return (

    <EmojiBoxStyle>

      <div className="emoji-bar">

        <input type="text" placeholder="Search for an emoji..." onInput={filterEmoji} />

      </div>

      <div className="emoji-icons">

        {filteredEmojis.map(emoji => <div key={emoji.name} onClick={e => theEmoji(e.target.innerText)} className="emoji-icon">{emoji.emoji}</div>)}

        {filteredEmojis.length === 0 && <div className="nil">Emoji not found</div>}

      </div>

    </EmojiBoxStyle>

  )

}

const EmojiBoxStyle = styled.div`

  background-color: white;
  border-radius: 0.5pc;
  overflow: hidden;
  width: 100%;
  background-color: #f4f4f4;

  .emoji-bar{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid #d0d0d0;

    input{
      width: 100%;
      border: 0 none;
      outline: 0 none;
      background-color: transparent;
      padding: 0.5pc;
      font-size: .9pc;
      text-align: center;
    }

  }

  .emoji-icons{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    height: ${5 * 3}pc;
    overflow: auto;

    .emoji-icon{
      font-size: 1pc;
      width: 2.95pc;
      height: 3pc;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color .5s, color .5s;

      &:hover{
        background-color: rgba(0, 0, 0, .2);
      }
    }

  }

  .nil{
    width: 100%;
    font-size: 2pc;
    line-height: 5pc;
    text-align: center;
  }
`

export default EmojiBox
