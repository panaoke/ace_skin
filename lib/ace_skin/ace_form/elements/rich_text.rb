module AceSkin
  module AceForm
    module Elements
      class RichText < Base

	      def ext_html
		      {'data-toggle' => :rich_text, class: "#{dom_class} wysiwyg-editor", type: :text}
	      end

	      def template
		      options[:template] || :no_desc
	      end

	      def output
		      content_tag(:div,  html) do
			      value.try(:html_safe)
		      end
	      end

      end
    end
  end
end
