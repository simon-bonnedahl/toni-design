
import React from 'react'
import { urlFor } from '../sanity';
interface Props{
  title:string,
  image:string,
  price:number,
  width:number,
  height:number,

}
const ProductCard: React.FC<Props> = ({title, image, price, width, height}) => {

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md">
    <div className='w-10/12 m-auto mt-4 h-40 bg-gray-100 rounded-md flex items-center justify-center '>
        <img className="p-20" src={urlFor(image).url()} alt="product image" />
    </div>
    <div className="p-10">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h5>
        <p>{width} x {height} </p>
        
       
        <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 ">{price} kr</span>
            <a href="#" className="text-white bg-blue-400 hover:scale-110 ease-in-out duration-300  font-medium rounded-lg text-sm p-3 text-center">Add to cart</a>
        </div>
    </div>
</div>
  )
};

export default ProductCard;