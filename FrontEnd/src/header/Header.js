import logo from './ecocompress.svg';
const Header = () => {
    return ( 
        <header className="flex justify-start items-center w-[100%] text-[2rem] pt-8" >
            <img src={logo} alt="Logo" width="120px"/>
        </header>
     );
}
 
export default Header;