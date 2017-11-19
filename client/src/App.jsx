import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    background: #fff;
    margin: 40px auto 0;
    padding: 20px;
    text-align: center;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.39);
    min-height: 100px;
    width: 600px;
    font-size: 16px;
    & input {
        font-size: inherit;
    }
`;

const Results = styled.div`
    margin-top: 10px;
`;

const List = styled.ol`
    display: inline-block;
    teext-align: left;
`;

const Li = styled.li`
    padding: 5px;
`;


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      links: [],
    };
    this.submit = this.submit.bind(this);
  }

  submit(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);

    fetch('/file', {
      method: 'POST',
      body: form,
    })
      .then(res => res.json())
      .then((res) => {
        this.setState({ links: [...this.state.links, res.url] });
      });
  }

  render() {
    const { links } = this.state;

    return (
      <Wrapper>
        <form onSubmit={this.submit}>
          <input type="file" name="file" ref={fileInput => this.fileInput = fileInput} />
          <input type="submit" value="Отправить" />
        </form>
        {
            links.length ?
              <Results>
                <h2>Ваши загрузки:</h2>
                <List>
                  {
                links.map(item => <Li key={item}> <a href={item}>{item}</a></Li>)
                }
                </List>
              </Results>
            : null
        }

      </Wrapper>
    );
  }
}

export default App;

