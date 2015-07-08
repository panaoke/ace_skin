module AceSkin
  module AceForm
    module Elements
      class Position < Base

        def ext_html
          html_attrs = {'data-toggle' => 'position', class: dom_class}
          self.default_value.update(value || {}).each do |name, value|
            html_attrs["data-#{name}"] = value
          end
          html_attrs
        end

        def default_value
          {'longitude' => 0.0, 'latitude' => 0.0, 'address' => ''}
        end

        def output
          content_tag(:div,  class: :form_position, name: dom_name) do
            r1 = content_tag(:span,  ext_html) do
              value.try{|v| v['address']}
            end
            r2 = self.default_value.update(value || {}).map do |k,v|
              content_tag(:input, name: "#{dom_name}[#{k}]", value: v, type: :hidden) do
              end
            end.join(' ').html_safe
            r1 << r2
            r1
          end
        end

      end
    end
  end
end
