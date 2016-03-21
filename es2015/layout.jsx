const Container =() =>
  <div id='container'>
    <Title/>
    <Controls/>
  </div>;

const Title = () => <h1 id='title'>Hyperbolic Tiling</h1>;

class Controls extends React.Component {
  clickTest(){
    console.log('click!');
  }
  render() {
    return (
      <div id='controls'>
        <Button id='test' click={this.clickTest}>Test</Button>
      </div>
    );
  }
}

class Button extends React.Component {
  render(){
    return (
      <button className='button' id={this.props.id} onClick={this.props.click}>
        {this.props.children}
      </button>
    );
  }
}

//takes an options object:
// {
//  selected: index of array
//  values: []
// }
class Dropdown extends React.Component {
  render(){
    const optionNodes = this.props.options.map(function(option){
      return (

      );
    });
    return (
      <select className='select' id={this.props.id} value={this.props.value}>
        {optionNodes}
      <select>
    );
  }
}

export const render = () => {
  ReactDOM.render(
    <Container/>,
    document.querySelector('#root')
  );
}
