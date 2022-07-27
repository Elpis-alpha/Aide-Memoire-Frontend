import StarterKit from "@tiptap/starter-kit"

import styled from "styled-components"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"

import TextStyle from "@tiptap/extension-text-style"

import EditorLink from "@tiptap/extension-link"

import EditorImage from "@tiptap/extension-image"

import EditorPlaceholder from "@tiptap/extension-placeholder"

import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode, FaSubscript, FaSuperscript, FaUndoAlt, FaRedoAlt } from "react-icons/fa"

import { RiLineHeight } from "react-icons/ri"

import { BsBlockquoteLeft, BsListOl, BsListUl, BsLink45Deg, BsImageFill } from "react-icons/bs"

import { AiOutlineFontColors, AiOutlineBgColors, AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai"

import { HiOutlineEmojiHappy } from "react-icons/hi"

import { FontSize, WorkClass, TextColor, FontFamily, BgColor, LineHeight, Underline } from "./customExtensions"

import Emoji from "../emoji/Emoji"

import { useState } from "react"

import LinkQuery from "./LinkQuery"

import ImageQuery from "./ImageQuery"


const FullEditor = ({ editorState, setEditorState, placeholder = "" }) => {

  const [showEmoji, setShowEmoji] = useState(false)

  const [showFontFamilies, setShowFontFamilies] = useState(false)

  const [showLinkQ, setShowLinkQ] = useState(false)

  const [showImageQ, setShowImageQ] = useState(false)

  const [showLineHeights, setShowLineHeights] = useState(false)

  const listOfFonts = [

    { name: "Default Font", text: "" },

    { name: "Serif Font", text: "serif" },

    { name: "Cursive Font", text: "cursive" },

    { name: "Sans Serif", text: "sans-serif" },

    { name: "Monospace", text: "monospace" },

    { name: "Fantasy", text: "fantasy" },

    { name: "Times New Roman", text: "'Times New Roman', Times, serif" },

    { name: "Arial", text: "Arial, Helvetica, sans-serif" },

    { name: "Cambria", text: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif" },

    { name: "Impact", text: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },

    { name: "Verdana", text: "Verdana, Geneva, Tahoma, sans-serif" },

    { name: "Courier New", text: "'Courier New', Courier, monospace" },

  ]

  const listOfLineHeights = [
    '1', '1.5',
    '2', '2.5',
    '3', '3.5',
    '4', '4.5',
    '5', '5.5',
    '6', '6.5',
    '7', '7.5',
    '8', '8.5',
  ]

  const editor = useEditor({

    extensions: [

      StarterKit, TextStyle, FontSize,

      WorkClass, TextColor, FontFamily,

      BgColor, LineHeight, EditorImage.configure({ allowBase64: true, }),

      EditorLink.configure({ openOnClick: false }),

      Underline, EditorPlaceholder.configure({ placeholder })

    ],

    content: editorState,

    autofocus: true,

    onUpdate: ({ editor }) => setEditorState(editor.getHTML())

  })

  const chainX = command => {

    if (!editor) { return null }

    const incrementList = [
      '0.2pc', '0.4pc', '0.6pc', '0.8pc', '1.0pc',
      '1.2pc', '1.4pc', '1.6pc', '1.8pc', '2.0pc',
      '2.2pc', '2.4pc', '2.6pc', '2.8pc', '3.0pc',
      '3.2pc', '3.4pc', '3.6pc', '3.8pc', '4.0pc',
      '4.2pc', '4.4pc', '4.6pc', '4.8pc', '5.0pc',
      '5.2pc', '5.4pc', '5.6pc', '5.8pc', '6.0pc',
    ]

    switch (command) {

      case "font": return setShowFontFamilies(!showFontFamilies)

      case "line-height": return setShowLineHeights(!showLineHeights)

      case "bold": return editor.chain().focus().toggleBold().run()

      case "italic": return editor.chain().focus().toggleItalic().run()

      case "strike": return editor.chain().focus().toggleStrike().run()

      case "code": return editor.chain().focus().toggleCode().run()

      case "underline": return editor.chain().focus().toggleUnderline().run()

      case "sub": return editor.chain().focus().toggleClass('make-sub').run()

      case "sup": return editor.chain().focus().toggleClass('make-sup').run()

      case "blockquote": return editor.chain().focus().toggleBlockquote().run()

      case "undo": return editor.chain().focus().undo().run()

      case "redo": return editor.chain().focus().redo().run()

      case "o-list": return editor.chain().focus().toggleOrderedList().run()

      case "u-list": return editor.chain().focus().toggleBulletList().run()

      case "emoji": setShowEmoji(!showEmoji); return editor.chain().focus().run()

      case "link-x": setShowLinkQ(!showLinkQ); return editor.chain().focus().run()

      case "image-x": setShowImageQ(!showImageQ); return editor.chain().focus().run()

      case "h+":

        let newSize = editor.getAttributes('textStyle').fontSize

        newSize = typeof newSize !== 'string' ? "0.8pc" : newSize

        newSize = incrementList.findIndex(x => x === newSize) + 1

        newSize = newSize >= incrementList.length ? incrementList[newSize - 1] : incrementList[newSize]

        const newLineHeight = parseFloat(newSize) * 2 + 'pc'

        return editor.chain().focus().setFontSize(newSize).setLineHeight(newLineHeight).run()

        break;

      case "h-":

        let newSizeX = editor.getAttributes('textStyle').fontSize

        newSizeX = typeof newSizeX !== 'string' ? "0.8pc" : newSizeX

        newSizeX = incrementList.findIndex(x => x === newSizeX) - 1

        newSizeX = newSizeX < 0 ? incrementList[newSizeX + 1] : incrementList[newSizeX]

        const newLineHeightX = parseFloat(newSizeX) * 2 + 'pc'

        return editor.chain().focus().setFontSize(newSizeX).setLineHeight(newLineHeightX).run()

        break;

      default: return editor.chain().focus().run()

    }

  }

  const activeClass = (test) => {

    if (!editor) { return null }

    switch (test) {

      case 'emoji': return showEmoji ? 'is-active' : 'inactive'

      case 'font': return showFontFamilies ? 'is-active' : 'inactive'

      case 'link': return showLinkQ ? 'is-active' : 'inactive'

      case 'image': return showImageQ ? 'is-active' : 'inactive'

      case 'line': return showLineHeights ? 'is-active' : 'inactive'

      default: return editor.isActive(test) ? 'is-active' : 'inactive'

    }

  }

  const removeEmoji = e => {

    try {

      if (e.target.classList.contains('emoji-hol')) { setShowEmoji(false) }

      if (e.target.classList.contains('emoji-hol')) { setShowLinkQ(false) }

      if (e.target.classList.contains('emoji-hol')) { setShowImageQ(false) }

    } catch (e) {

      // do nothing

    }

  }

  const findFont = font => {

    let fon = listOfFonts.find(item => item.text === font)

    return fon === undefined ? 'Default Font' : fon.name

  }

  const findColor = color => color === undefined ? 'transparent' : color;

  const changeFont = font => editor.chain().focus().setFontFamily(font.text).run()

  const changeLH = height => editor.chain().focus().setLineHeight(height + 'pc').run()

  const changeColor = color => editor.chain().focus().setTextColor(color).run()

  const changeBgColor = color => editor.chain().focus().setBgColor(color).run()

  const addImage = base64 => editor.commands.setImage({ src: base64, alt: 'inserted image' })

  const setLinkStuff = (text, address) => {

    return editor.chain().focus().extendMarkRange('link').setLink({

      href: address,

      target: '_blank'

    }).command(({ tr }) => {

      tr.insertText(text)

      return true

    }).run()

  }

  if (!editor) { return null }

  return (

    <EditorStyle>

      <div className="editor-icons">

        <div className="icon-ed-divi">

          <div onClick={() => chainX('font')} className={"editor-norm-icon with-arrow fmt " + activeClass('font')}>

            <div className="xmt">{findFont(editor.getAttributes('textStyle').fontFamily)}</div>

            <AiOutlineCaretDown size=".9pc" style={{ paddingLeft: ".25pc" }} />

            {showFontFamilies && <div className="overflow-list">

              {listOfFonts.map(font => <li key={font.name} onClick={() => changeFont(font)} >{font.name}</li>)}

            </div>}

          </div>

          <div onClick={() => chainX('h+')} className="editor-norm-icon with-arrow">

            <div>A</div>

            <AiOutlineCaretUp size=".9pc" style={{ paddingLeft: ".1pc" }} />

          </div>

          <div onClick={() => chainX('h-')} className="editor-norm-icon with-arrow">

            <div>A</div>

            <AiOutlineCaretDown size=".9pc" style={{ paddingLeft: ".1pc" }} />

          </div>

          <div onClick={() => chainX('emoji')} className={"editor-norm-icon " + activeClass('emoji')}><HiOutlineEmojiHappy size="1pc" /></div>

          <div className="break-three"></div>

          <div className="editor-norm-icon">

            <AiOutlineBgColors size=".8pc" />

            <div className="absol-me" style={{ backgroundColor: `${findColor(editor.getAttributes('textStyle').bgColor)}` }}>

              <input type="color" onInput={e => changeBgColor(e.currentTarget.value)} />

            </div>

          </div>

          <div onClick={() => chainX('line-height')} className={"editor-norm-icon with-arrow " + activeClass('line')}>

            <RiLineHeight size="1pc" />

            <AiOutlineCaretDown size=".9pc" style={{ paddingLeft: ".25pc" }} />

            {showLineHeights && <div className="overflow-list">

              {listOfLineHeights.map(item => <li key={item} onClick={() => changeLH(item)} >{item}</li>)}

            </div>}

          </div>

          <div onClick={() => chainX('link-x')} className={"editor-norm-icon " + activeClass('link')}><BsLink45Deg size="1pc" /></div>

          <div onClick={() => chainX('image-x')} className={"editor-norm-icon " + activeClass('image')}><BsImageFill size="1pc" /></div>

        </div>

        <div className="icon-ed-divi">

          <div onClick={() => chainX('bold')} className={"editor-norm-icon " + activeClass('bold')}><FaBold size=".8pc" /></div>

          <div onClick={() => chainX('italic')} className={"editor-norm-icon " + activeClass('italic')}><FaItalic size=".8pc" /></div>

          <div onClick={() => chainX('underline')} className={"editor-norm-icon " + activeClass({ underline: 'underline' })}><FaUnderline size=".8pc" /></div>

          <div onClick={() => chainX('strike')} className={"editor-norm-icon " + activeClass('strike')}><FaStrikethrough size=".8pc" /></div>

          <div onClick={() => chainX('code')} className={"editor-norm-icon " + activeClass('code')}><FaCode size=".8pc" /></div>

          <div onClick={() => chainX('sup')} className={"editor-norm-icon " + activeClass({ className: 'make-sup' })}><FaSuperscript size=".8pc" /></div>

          <div onClick={() => chainX('sub')} className={"editor-norm-icon " + activeClass({ className: 'make-sub' })}><FaSubscript size=".8pc" /></div>

          <div className="editor-norm-icon">

            <AiOutlineFontColors size=".8pc" />

            <div className="absol-me" style={{ backgroundColor: `${findColor(editor.getAttributes('textStyle').textColor)}` }}>

              <input type="color" onInput={e => changeColor(e.currentTarget.value)} />

            </div>

          </div>

          <div className="break-three"></div>

          <div onClick={() => chainX('blockquote')} className={"editor-norm-icon " + activeClass('blockquote')}><BsBlockquoteLeft size="1pc" /></div>

          <div onClick={() => chainX('o-list')} className={"editor-norm-icon " + activeClass('orderedList')}><BsListOl size="1pc" /></div>

          <div onClick={() => chainX('u-list')} className={"editor-norm-icon " + activeClass('bulletList')}><BsListUl size="1pc" /></div>

          <div onClick={() => chainX('undo')} className="editor-norm-icon"><FaUndoAlt size="1pc" /></div>

          <div onClick={() => chainX('redo')} className="editor-norm-icon"><FaRedoAlt size="1pc" /></div>

        </div>

        <div className="overflow-items">

          {showEmoji && <div className="emoji-hol" onClick={removeEmoji}>

            <Emoji theEmoji={em => { editor.commands.insertContent(em); setShowEmoji(false); editor.chain().focus() }} />

          </div>}

          {showLinkQ && <div className="emoji-hol" onClick={removeEmoji}>

            <LinkQuery theLink={(linkText, address) => { setLinkStuff(linkText, address); setShowLinkQ(false); editor.chain().focus() }} />

          </div>}

          {showImageQ && <div className="emoji-hol" onClick={removeEmoji}>

            <ImageQuery theImage={base64 => { addImage(base64); setShowImageQ(false); editor.chain().focus() }} />

          </div>}

        </div>

      </div>

      <div className="editor-holder">

        {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 500 }}>

          <div className="select-text">

            <div onClick={() => chainX('h+')} className="editor-sel-icon with-arrow">

              <div>A</div>

              <AiOutlineCaretUp size=".9pc" style={{ paddingLeft: ".1pc" }} />

            </div>

            <div onClick={() => chainX('h-')} className="editor-sel-icon with-arrow">

              <div>A</div>

              <AiOutlineCaretDown size=".9pc" style={{ paddingLeft: ".1pc" }} />

            </div>

            <div onClick={() => chainX('bold')} className={"editor-sel-icon " + activeClass('bold')}><FaBold size=".8pc" /></div>

            <div onClick={() => chainX('italic')} className={"editor-sel-icon " + activeClass('italic')}><FaItalic size=".8pc" /></div>

            <div onClick={() => chainX('underline')} className={"editor-sel-icon " + activeClass({ underline: 'underline' })}><FaUnderline size=".8pc" /></div>

            <div onClick={() => chainX('strike')} className={"editor-sel-icon " + activeClass('strike')}><FaStrikethrough size=".8pc" /></div>

            <div onClick={() => chainX('code')} className={"editor-sel-icon " + activeClass('code')}><FaCode size=".8pc" /></div>

          </div>

        </BubbleMenu>}

        <EditorContent editor={editor} />

      </div>


    </EditorStyle>

  )

}

const EditorStyle = styled.div`

  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  .editor-icons{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    padding: 0 .3rem;
    padding-bottom: 0.5pc;
    
    .icon-ed-divi{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
      max-width: 100%;
      padding: 0;
    }
    
    .editor-norm-icon{
      width: 1.8pc;
      height: 1.8pc;
      line-height: 1pc;
      font-size: .9pc;
      flex-shrink: 0;
      color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.1rem;
      margin: .25pc .3pc;
      cursor: pointer;
      box-shadow: 0 0 1px 0 grey;
      background-color: transparent;
      transition: background-color .5s;
      z-index: 5;
      
      &.with-arrow{
        width: auto;
        padding: 0 .3pc;
        z-index: 10;
      }
      
      &.fmt{
        z-index: 15;
        .xmt{
          max-width: 8pc;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      &:hover{
        background-color: rgba(0, 0, 0, .2);
      }

      &.is-active{
        background-color: rgba(0, 0, 0, .3);
      }

      .overflow-list{
        position: absolute;
        top: 105%; left: 0;
        width: 100%;
        background-color: #c0c0c0;
        max-height: 5pc;
        overflow: auto;

        li{
          width: 100%;
          text-align: left;
          list-style-type: none;
          padding: 0.2pc;
          padding-left: .5rem;
          transition: background-color .5s;
          overflow: hidden;
          font-size: .8pc;

          &:hover{
            background-color: rgba(0, 0, 0, .2);
          }

          &.is-active{
            background-color: rgba(0, 0, 0, .3);
          }

          max-width: 8pc;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

        }
      }

      .absol-me{
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        cursor: pointer;
        opacity: .3;
        background-color: transparent;
        
        input{
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0; bottom: 0;
          left: 0; right: 0;
        }
      }
    }

    .break-two{ width: 100%}
    .break-three{ width: 0%}
    
    @media screen and (max-width: 560px) {
      .break-two{ width: 0%}
      .break-three{ width: 100%}
      .editor-norm-icon{
        margin: .25pc .4pc;
      }
    }
    
    @media screen and (max-width: 380px) {
      .editor-norm-icon{
        margin: .25pc .3pc;
      }
    }

  }

  .overflow-items{
    position: absolute;
    top: 101%; left: 0;
    right: 0; z-index: 20;

    .emoji-hol{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .editor-holder{
    box-shadow: 0 0 1px 0 grey inset;
    z-index: 5;
    height: 100%;
    max-height: 100%;
    overflow: auto;

    .ProseMirror{
      border: 0 none;
      outline: 0 none;
      padding: .2pc .5pc;
      min-height: 100%;

      code{
        font-family: 'Courier New', Courier, monospace;
        background-color: rgba(0, 0, 0, .8);
        display: inline-block;
        color: white;
      }

      blockquote{
        display: block;
        padding-left: .5pc;
        margin-left: .5pc;
        border-left: 3px solid #c0c0c0;
      }

      .make-sub{
        font-size: .5pc;
        vertical-align: sub;
      }

      .make-sup{
        font-size: .5pc;
        vertical-align: super;
      }

      ul,ol{
        padding-left: 2rem;
      }

      img{
        max-width: 100%;
        max-height: 50vh;
        display: block;
        border-radius: .2rem;
      }

      p.is-editor-empty:first-child::before{
        content: attr(data-placeholder);
        color: rgba(0, 0, 0, .5);
        float: left;
        height: 0;
        pointer-events: none;
      }

    }

    .select-text{
      display: flex;
      background-color: #efefef;
      /* border-radius: .5pc; */
      overflow: hidden;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .3);

      .editor-sel-icon{
        width: 2.2pc;
        height: 2.2pc;
        line-height: 1pc;
        font-size: .9pc;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.1rem;
        cursor: pointer;
        background-color: transparent;
        transition: background-color .5s;
        border-right: 1px solid rgba(0, 0, 0, .1);

        &.with-arrow{
          width: auto;
          padding: 0 .3pc;
        }

        &:hover{
          background-color: rgba(0, 0, 0, .2);
        }

        &.is-active{
          background-color: rgba(0, 0, 0, .3);
        }

        &:last-of-type{
          border-right: 0 none;
        }
      }
    }
  }

`

export default FullEditor
