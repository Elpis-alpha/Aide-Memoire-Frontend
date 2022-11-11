import HeadTag from '../source/components/general/HeadTag'

import styled from "styled-components"
import { complain } from '../source/__env'
import ProtectLinks from '../source/components/general/ProtectLinks'



const PageNotFound = () => {

  return (

    <PageStyle>

      <ProtectLinks />

      <HeadTag title="404" />

      <div className='nm'>

        <h1>404</h1>

        <p>Unfortunately, it seemes the page you requested for doesn&apos;t currently exist.</p>

        <small>If you have any doubts regarding why this doesn&apos;t exist, kindly <a href={complain} target="_blank" rel="noopener noreferrer">lodge a complaint here</a></small>

      </div>

    </PageStyle>

  )

}

const PageStyle = styled.div`

  padding: 2rem;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  color: black;
  
  .nm{
    margin: auto;
    text-align: center;

    h1{
      font-size: 5pc;
      line-height: 6pc;
    }

    p{
      font-size: 1pc;
      padding: .5rpc
    }

    small{
      font-size: .8pc;
      font-style: italic;
    }
  }
`

export default PageNotFound
