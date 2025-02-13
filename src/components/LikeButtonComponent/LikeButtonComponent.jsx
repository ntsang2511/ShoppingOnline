function LikeButtonComponent({ dataHref }) {
  return (
    <div>
      <div
        className="fb-like"
        data-href={dataHref}
        data-width=""
        data-layout=""
        data-action=""
        data-size=""
        data-share="true"
      ></div>
    </div>
  )
}

export default LikeButtonComponent
