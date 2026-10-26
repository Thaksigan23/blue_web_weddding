import React from 'react';
import WalkingCouple from './WalkingCouple';
import PreviousCouple from './WalkingCoupleFallback';

class RigFallback extends React.Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<PreviousCouple reduced={this.props.reduced}/>:this.props.children}
}
export default function IllustratedCouple({reduced}) {
  return <div className="couple-travel" data-character-mode="procedural-svg">
    <div className="foot-glow"/>
    <RigFallback reduced={reduced}><WalkingCouple reduced={reduced}/></RigFallback>
  </div>;
}
