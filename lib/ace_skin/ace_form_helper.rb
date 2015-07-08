module AceSkin
  module AceFormHelper
    def ace_from(option, &block)
      raise ArgumentError, "Missing block" unless block_given?
      form = AceSkin::AceForm::Form.new(option)
      render({partial: "/ace_form/form/#{form.template}", locals: {form: form, block: block}}).html_safe
    end

    def ace_input(option, &block)
      input = AceSkin::AceForm::Element.new(option)
      render({partial: "/ace_form/element/#{input.template}", locals: {input: input, block: block}}).html_safe
    end
  end
end