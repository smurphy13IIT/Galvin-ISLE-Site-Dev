export default function tuitionFees() {
  $('.costs__accordion-button').click(event => {
    $(event.target)
      .next('.costs__accordion__content')
      .slideToggle();
  });
}
