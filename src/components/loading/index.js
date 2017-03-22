import { h, Component } from 'preact';
import style from './style';

export default class extends Component {
  render () {
    return (
      <div class={style.loading}>
        Loading...
      </div>
    );
  }
}
