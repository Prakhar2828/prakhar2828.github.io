// Reconstruction receives observed sensors and geometry weights. Hidden truth is only used by score().
export function reconstruct(observed, geometry, method='estimated') {
 const T=observed[0].length,profiles=Array.from({length:10},()=>0),counts=Array(10).fill(0);
 for(let o=0;o<observed.length;o++){const h=geometry.observed_heights[o];profiles[h]+=observed[o].reduce((a,b)=>a+b,0)/T;counts[h]++;}
 for(let h=0;h<profiles.length;h++)profiles[h]/=counts[h];
 return geometry.neighbors.map((neighbors,u)=>Array.from({length:T},(_,t)=>{
  let value=method==='estimated'?profiles[geometry.hidden_heights[u]]:0;
  for(let j=0;j<neighbors.length;j++){const o=neighbors[j];value+=geometry.weights[u][j]*(observed[o][t]-(method==='estimated'?profiles[geometry.observed_heights[o]]:0));}
  return value;
 }));
}
export function score(prediction, truth){let sum=0,absolute=0,n=0;for(let u=0;u<truth.length;u++)for(let t=0;t<truth[u].length;t++){const e=prediction[u][t]-truth[u][t];sum+=e*e;absolute+=Math.abs(e);n++;}return {rmse:Math.sqrt(sum/n),mae:absolute/n,n};}
