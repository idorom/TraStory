import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FooterContainer,
    FooterWrap,
    SocialMedia,
    SocialMediaWrap,
    SocialIcons,
    WebsiteRights,
    SocialIconLink,
    SocialLogo
} from './FooterElements';

const Footer = () => {
    return (
    
        <FooterContainer>
          <FooterWrap> 
              <SocialMedia>
                  <SocialMediaWrap>
                      <SocialLogo to='./'> TraStory </SocialLogo>
                       <WebsiteRights> אוניברסיטת חיפה {new Date().getFullYear()} כל הזכויות שמורות   </WebsiteRights>
                       <SocialIcons>
                           <SocialIconLink herf='/' target='_blank' aria-label= 'Fackbook'> 
                       <FaFacebook/>
                      </SocialIconLink>
                      <SocialIconLink herf='/' target='_blank' aria-label= 'Instagram'> 
                       <FaInstagram/>
                      </SocialIconLink>
                      <SocialIconLink herf='/' target='_blank' aaria-label= 'Youtube'> 
                       <FaYoutube/>
                      </SocialIconLink>
                       </SocialIcons>
                  </SocialMediaWrap>
              </SocialMedia>
          </FooterWrap> 
        </FooterContainer>
        
    )
}

export default Footer
